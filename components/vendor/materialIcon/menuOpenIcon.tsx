import MenuOpenIcon from '@mui/icons-material/MenuOpen';

type IconProps = {
  fontSize?: 'medium' | 'small' | 'large';
};

const MaterialMenuOpenIcon: React.FC<IconProps> = ({ ...props }) => {
  return (
    <MenuOpenIcon {...props} />
  );
};

export default MaterialMenuOpenIcon;
