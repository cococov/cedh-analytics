import MenuIcon from '@mui/icons-material/Menu';

type IconProps = {
  fontSize?: 'medium' | 'small' | 'large';
};

const MaterialMenuClosedIcon: React.FC<IconProps> = ({ ...props }) => {
  return (
    <MenuIcon {...props} />
  );
};

export default MaterialMenuClosedIcon;
