import type { DynIconProps } from '../packages/dyn-ui-react/src/components/DynIcon/DynIcon.types';
import { DynIcon as DynIconInner } from '../packages/dyn-ui-react/src/components/DynIcon';

const DynIcon = (props: DynIconProps) => <DynIconInner {...props} />;

export { DynIcon };
export default DynIcon;
