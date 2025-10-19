import type { DynButtonProps } from '../packages/dyn-ui-react/src/components/DynButton/DynButton.types';
import { DynButton as DynButtonInner } from '../packages/dyn-ui-react/src/components/DynButton';

const DynButton = (props: DynButtonProps) => <DynButtonInner {...props} />;

export { DynButton };
export default DynButton;
