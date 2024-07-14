import { checkEvery, ConfigCheckInterval, getCheckEvery, getCheckEveryInt, getPluginEnabled, setCheckEvery, setPluginEnabled } from "./config";

function onClickMenuItem() {
	// Write code here that should happen when the player clicks the menu item under the map icon.
	openWindow();
}

var handle: Window | undefined = undefined;
var repaymentType: ConfigCheckInterval = "tick";

function openWindow() {
	if (handle === undefined) {
		handle = ui.openWindow({
			classification: 'automatic-loan-repayer',
			width: 256,
			height: 64,
			title: 'Automatic Loan Repayer - Options',

			onClose: function () {
				handle = undefined
			},
			widgets: [{
				type: 'checkbox',
				text: 'Enable auto repayment',
				isChecked: getPluginEnabled(),
				tooltip: 'Automatically repays loans if possible.',
				x: 5,
				y: 20,
				width: 120,
				height: 12,
				onChange: function (isChecked: boolean) {
					oldBankLoan = park.bankLoan
					setPluginEnabled(isChecked);
					if (isChecked) {
						createSubscription();
					}
				},
			}, {
				type: 'label',
				width: 150,
				height: 12,
				x: 18,
				y: 35,
				text: 'Attempt to repay every',
			},
			{
				type: 'dropdown',
				x: 210,
				y: 35,
				width: 40,
				height: 12,

				items: ['tick', 'day', 'month'],
				selectedIndex: getCheckEveryInt(),
				onChange: function (i: number) {
					repaymentType = checkEvery[i];
					setCheckEvery(repaymentType);
					createSubscription()
				}

			},
			]
		});
	}
}

// Yes, intentional. Money is measured in dimes; $1000 = 10,000 units.
const ONE_THOUSAND_DOLLARS = 10_000

var oldBankLoan: number = Number.MAX_VALUE

function attemptLoanPaybackMonthly() {
	if (date.day === 1) {
		attemptLoanPayback();
	}
}

function attemptLoanPayback() {

	if (!getPluginEnabled()) {
		return;
	}

	if (park.bankLoan > oldBankLoan) {
		// we took out a loan, stop autorepayment
		setPluginEnabled(false);
		park.postMessage({ type: 'money', text: 'Automatic loan repayment disabled due to loan being increased.' });
		return;
	}

	oldBankLoan = park.bankLoan


	if (park.bankLoan === 0 || park.cash < ONE_THOUSAND_DOLLARS) {
		return;
	}

	const payments = Math.floor(park.cash / ONE_THOUSAND_DOLLARS)
	// honestly don't know how it could be _less than_ zero here, but I've seen weirder stuff in other codebases
	if (payments <= 0) {
		return;
	}

	const amount = Math.min(payments * ONE_THOUSAND_DOLLARS, oldBankLoan)

	context.executeAction('parksetloan', { value: oldBankLoan - amount }, (res) => {
		const { error } = res;
		if (error !== 0) {
			console.log(res);
		}
	})

	const loan = park.bankLoan
	if (oldBankLoan !== 0 && loan === 0) {
		park.postMessage({ type: 'money', text: 'Your loan has been paid off.' });
		setPluginEnabled(false);
	}

	oldBankLoan = loan;
}


var subscription: IDisposable | undefined = undefined;

function createSubscription() {
	subscription?.dispose();
	subscription = undefined;
	const interval = getCheckEvery();
	switch (interval) {
		case "tick":
			subscription = context.subscribe('interval.tick', attemptLoanPayback);
			break;
		case "day":
			subscription = context.subscribe('interval.day', attemptLoanPayback);
			break;
		case "month":
			subscription = context.subscribe('interval.day', attemptLoanPaybackMonthly);
			break;
	}

	oldBankLoan = park.bankLoan;
}

export function startup() {
	// Write code here that should happen on startup of the plugin.

	// Currently, make it only work for single player
	// TODO: Implement for multiplayer?
	if (network.mode !== 'none') { return; }

	// Disable on startup/load to avoid instantly repaying on load.
	setPluginEnabled(false);
	createSubscription()

	// Register a menu item under the map icon:
	if (typeof ui !== "undefined") {
		ui.registerMenuItem("Automatic Loan Repayer", () => onClickMenuItem());
	}
}