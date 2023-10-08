interface Window {
    readonly navigate: (route: string) => void;
    readonly meta: { isDev: any; openLink: (link: string) => void; isOnDaas: () => any; };
}
