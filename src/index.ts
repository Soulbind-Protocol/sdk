import { Base } from "./base";
import { Contract } from "./requests/contract";
import { EmailConnect } from "./requests/email-connect";
import { applyMixins } from "./utils/mixins";

class Soulbind extends Base { }
interface Soulbind extends Contract, EmailConnect { }

applyMixins(Soulbind, [Contract, EmailConnect]);

export * from './requests/types';

export default Soulbind;
