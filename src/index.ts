import { Base } from "./base";
import { Contract } from "./requests/contract";
import { applyMixins } from "./utils/mixins";

class Soulbind extends Base { }
interface Soulbind extends Contract { }

applyMixins(Soulbind, [Contract]);

export * from './requests/types';

export default Soulbind;
