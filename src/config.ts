export const NAMESPACE = "auto_loan_repayer"
export const PREFIX = `${NAMESPACE}.`

export type ConfigKey = 'pluginEnabled' | 'checkEvery'
export const checkEvery = ['tick', 'day', 'month'] as const
export type ConfigCheckInterval = 'tick' | 'day' | 'month';

function getKey<T>(key: ConfigKey, defaultValue: T): T {
    return context.sharedStorage.get(PREFIX + key, defaultValue)
}

function setKey<T>(key: ConfigKey, defaultValue: T) {
    return context.sharedStorage.set(PREFIX + key, defaultValue)
}

export function getPluginEnabled(): boolean {
    return getKey("pluginEnabled", false)
}

export function setPluginEnabled(enabled: boolean) {
    return setKey("pluginEnabled", enabled)
}

export function getCheckEvery(): ConfigCheckInterval {
    return getKey('checkEvery', 'tick')
}

export function getCheckEveryInt(): number {
    const key = getKey('checkEvery', 'tick')
    return checkEvery.indexOf(key);
}

export function setCheckEvery(interval: ConfigCheckInterval) {
    return setKey('checkEvery', interval)
}