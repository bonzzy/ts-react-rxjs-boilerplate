export class SimpleModel {
    id: string;
    title: string;
    description: string;

    constructor(title: string, description: string) {
        this.title = title;
        this.description = description;
        this.id = this.generateRandomId();
    }

    private generateRandomId(): string {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

}