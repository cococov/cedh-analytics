import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

type IconProps = {
  fontSize?: 'medium' | 'small' | 'large';
};

const MaterialArrowRightAltIcon: React.FC<IconProps> = ({ ...props }) => {
  return (
    <ArrowRightAltIcon {...props} />
  );
};

export default MaterialArrowRightAltIcon;
