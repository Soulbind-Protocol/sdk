// TODO(nocs): remove this comment when stable:
// Guide https://www.youtube.com/watch?v=pFzesWEXj0Y

import { Base } from "./base";
import { Contract } from "./requests/contract";
import { applyMixins } from "./utils/mixins";

class Soulbind extends Base { }
interface Soulbind extends Contract { }

applyMixins(Soulbind, [Contract]);

export default Soulbind;
