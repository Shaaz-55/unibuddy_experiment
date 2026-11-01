import Modal from './Modal';

export default function Drawer({ width = '480px', ...props }) {
  return <Modal {...props} maxWidth={width} variant="drawer" />;
}
