import { Request, Response } from 'express';

export class Admin {
    public static get(req: Request, res: Response): void {
        res.send(`
            <h3>Links</h3>
            <ul>
                <li><a href="/admin/clear-subscriptions">Clear subscriptions</a></li>
            </ul>
        `);
    }

    public static clearSubscriptions(req: Request, res: Response): void { 
        res.send('Cleared subscriptions');
    }
}