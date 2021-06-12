/* eslint-disable */
import { ChangeEvent, PureComponent } from 'react';
import Grow from '@material-ui/core/Grow';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import { withStyles } from '@material-ui/core/styles';
import { debounce } from 'lodash';
import { Theme } from '@material-ui/core';

const defaultSearchStyles = (theme: Theme) => ({
  main: {
    display: 'flex',
    flex: '1 0 auto',
  },
  searchIcon: {
    color: theme.palette.text.secondary,
    marginTop: '10px',
    marginRight: '8px',
  },
  searchText: {
    flex: '0.8 0',
  },
  clearIcon: {
    '&:hover': {
      color: theme.palette.error.main,
    },
  },
});

interface State {
  text: string;
}

class DebouncedTableSearch extends PureComponent<any, State> {
  private rootRef: HTMLDivElement | null;
  private searchField: HTMLInputElement | null;

  constructor(props: any) {
    super(props);
    const { searchText } = this.props;
    let value = searchText;
    if (searchText && searchText.value !== undefined) {
      value = searchText.value;
    }
    this.state = {
      text: value,
    };
    this.debouncedOnSearch = debounce(
      this.debouncedOnSearch.bind(this),
      this.props.debounceTime,
    );
    this.rootRef = null;
    this.searchField = null;
  }

  handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    this.setState(
      {
        text: value,
      },
      () => this.debouncedOnSearch(value),
    );
  };

  debouncedOnSearch = (value: string) => {
    this.props.onSearch(value);
  };

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown, false);
  }

  componentDidUpdate(prevProps: any, prevState: any, snapshot: any) {
    const { searchText } = this.props;
    if (
      searchText &&
      searchText.value !== undefined &&
      prevProps.searchText !== this.props.searchText
    ) {
      const { value } = searchText;
      if (value) {
        this.setState(
          {
            text: value,
          },
          () => this.props.onSearch(value),
        );
      } else {
        try {
          this.props.onHide();
        } catch (e) {
          // empty
        }
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown, false);
  }

  onKeyDown = (event: any) => {
    if (event.keyCode === 27) {
      this.props.onHide();
    }
  };

  render() {
    const { classes, options, onHide } = this.props;
    const { text: value } = this.state;
    return (
      <Grow appear in timeout={300}>
        <div className={classes.main} ref={(el) => (this.rootRef = el)}>
          <SearchIcon className={classes.searchIcon} />
          <TextField
            className={classes.searchText}
            autoFocus
            InputProps={{
              // 'data-test-id': options.textLabels.toolbar.search,
              'aria-label': options.textLabels.toolbar.search,
            }}
            value={value || ''}
            onChange={this.handleTextChange}
            fullWidth
            inputRef={(el) => (this.searchField = el)}
            placeholder={options.searchPlaceholder}
          />
          <IconButton className={classes.clearIcon} onClick={onHide}>
            <ClearIcon />
          </IconButton>
        </div>
      </Grow>
    );
  }
}

export default withStyles(defaultSearchStyles, { name: 'MUIDataTableSearch' })(
  DebouncedTableSearch,
);
