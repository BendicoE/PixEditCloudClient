import * as React from 'react';
import * as packageJson from '../package.json';

const appVersion = packageJson.version;

const semverGreaterThan = (versionA: string, versionB: string) => {
    const versionsA = versionA.split(/\./g);

    const versionsB = versionB.split(/\./g);
    while (versionsA.length || versionsB.length) {
        const a = Number(versionsA.shift());

        const b = Number(versionsB.shift());
        // eslint-disable-next-line no-continue
        if (a === b) continue;
        // eslint-disable-next-line no-restricted-globals
        return a > b || isNaN(b);
    }
    return false;
}

export class CacheBuster extends React.PureComponent {
    public state = {
        loading: true,
        isLatestVersion: false,
    };

    refreshCacheAndReload() {
        console.log('Clearing cache and hard reloading...');
        if (caches) {
            // Service worker cache should be cleared with caches.delete()
            caches.keys().then(async function (names) {
                await Promise.all(names.map(name => caches.delete(name)));
                window.location.reload(true);
            });
        }
    }

    componentDidMount() {
        fetch('/meta.json', { cache: 'no-cache' })
            .then((response) => response.json())
            .then((meta) => {
                const latestVersion = meta.version;
                const currentVersion = appVersion;

                const shouldForceRefresh = semverGreaterThan(latestVersion, currentVersion);
                if (shouldForceRefresh) {
                    console.log(`We have a new version - ${latestVersion}. Should force refresh`);
                    this.setState({ loading: false, isLatestVersion: false });
                } else {
                    console.log(`You already have the latest version - ${latestVersion}. No cache refresh needed.`);
                    this.setState({ loading: false, isLatestVersion: true });
                }
            });
    }

    render() {
        if (this.state.loading)
            return null;
        if (!this.state.loading && !this.state.isLatestVersion) {
            this.refreshCacheAndReload();
        }

        return this.props.children;
    }
}
