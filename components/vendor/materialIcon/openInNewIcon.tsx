import OpenInNewIcon from '@mui/icons-material/OpenInNew';

type IconProps = {
  fontSize?: 'medium' | 'small' | 'large';
};

const MaterialOpenInNewIcon: React.FC<IconProps> = ({ ...props }) => {
  return (
    <OpenInNewIcon {...props} />
  );
};

export default MaterialOpenInNewIcon;
