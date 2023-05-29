import pkg from './package.json'

export const getManifest = ({ dev }: { dev?: boolean }) =>
  ({
    name: `${pkg.extension.name}${dev ? ' (dev)' : ''}`,
    description: pkg.extension.description,
    version: pkg.version,
    manifest_version: 3,
    background: {
      service_worker: 'src/entries/background/index.ts',
    },
    content_scripts: [
      {
        matches: ['*://*/*'],
        js: ['src/entries/content/index.ts'],
        run_at: 'document_start',
        all_frames: true,
      },
    ],
    permissions: [
      'activeTab',
      'alarms',
      'contextMenus',
      'clipboardWrite',
      'notifications',
      'scripting',
      'storage',
      'tabs',
      'unlimitedStorage',
      'webRequest',
    ],
    host_permissions: ['*://*/*'],
    web_accessible_resources: [
      {
        resources: ['*.woff2'],
        matches: ['<all_urls>'],
      },
    ],
  }) satisfies chrome.runtime.Manifest
