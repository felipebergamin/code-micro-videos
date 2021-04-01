import { Container, makeStyles, Typography } from '@material-ui/core';

type PageProps = {
  title: string;
};

const useStyles = makeStyles({
  title: {
    color: '#999999',
  },
});

const Page: React.FC<PageProps> = ({ title, children }) => {
  const styles = useStyles();
  return (
    <Container>
      <Typography className={styles.title} variant="h5">
        {title}
      </Typography>
      {children}
    </Container>
  )
}

export default Page;