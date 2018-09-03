import { Request, Response } from 'express';
import { db } from './datastore';

export class Save {
    public static myName(req: Request, res: Response): void {
        const endpoint = req.body['endpoint'];
        const name = req.body['name'];
    
        db.update({ 'push.endpoint': endpoint }, { $set: { name: name } }, {}, (err: Error, numAffected: number) => {
            if (numAffected > 0) {
                res.send('Saved name!');
            } else {
                res.send('No records changed.');
            }
        });
    }
}