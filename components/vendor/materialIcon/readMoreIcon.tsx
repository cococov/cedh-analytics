import ReadMoreIcon from '@mui/icons-material/ReadMore';

type IconProps = {
  fontSize?: 'medium' | 'small' | 'large';
};

const MaterialReadMoreIcon: React.FC<IconProps> = ({ ...props }) => {
  return (
    <ReadMoreIcon {...props} />
  );
};

export default MaterialReadMoreIcon;
