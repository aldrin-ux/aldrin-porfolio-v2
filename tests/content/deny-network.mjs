// Inherited by build subprocesses: any attempted network request fails the offline test.
globalThis.fetch = async () => { throw new Error('Offline test prohibits network requests.'); };
