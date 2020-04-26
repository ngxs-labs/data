import 'core-js/proposals/reflect-metadata';
import 'zone.js/dist/zone';

import { Any } from '@ngxs-labs/data/typings';

(window as Any)['__importDefault'] =
    (this && (this as Any).__importDefault) ||
    function (mod: Any): Any {
        return mod && mod.__esModule ? mod : { default: mod };
    };
