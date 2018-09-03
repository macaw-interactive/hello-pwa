import * as Datastore from 'nedb';
import * as path from 'path';

export const db = new Datastore({ filename: path.resolve(__dirname, './subscribers.db'), autoload: true });
