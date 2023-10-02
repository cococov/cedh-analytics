import WhatsAppIcon from '@mui/icons-material/WhatsApp';

type IconProps = {
  fontSize?: 'medium' | 'small' | 'large';
  sx?: { color?: string, fontSize?: number };
};

const MaterialWhatsAppIconIcon: React.FC<IconProps> = ({ ...props }) => {
  return (
    <WhatsAppIcon {...props} />
  );
};

export default MaterialWhatsAppIconIcon;
