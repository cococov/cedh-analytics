import EmailIcon from '@mui/icons-material/Email';

type IconProps = {
  fontSize?: 'medium' | 'small' | 'large';
  sx?: { color?: string, fontSize?: number };
};

const MaterialEmailIconIcon: React.FC<IconProps> = ({ ...props }) => {
  return (
    <EmailIcon {...props} />
  );
};

export default MaterialEmailIconIcon;
