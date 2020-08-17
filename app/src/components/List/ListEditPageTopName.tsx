import React, { useState, useEffect, useRef, SyntheticEvent, FC } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  FormControlLabel,
  FormGroup,
  Grid,
  Icon,
  InputLabel,
  OutlinedInput,
  Switch,
  TextField,
  Typography,
} from "@material-ui/core";
import { useStyles } from "../../assets/style/list/page.style";
import { useDispatch, useSelector } from "react-redux";
import { useListActions } from "../../features/list/listFeatureSlice";
import { useListMetaActions } from "../../features/list/listMetaFeatureSlice";
import { useListHelpers } from "../../features/list/listHelpers";

interface Props {
  this_list: ApparatusList.ListData;
  data: {
    getList: {
      name: string;
      description: string;
    };
  };
  getHoverStateByIdHandler: (id: string) => any;
  changeHoverState: ({ id, is_hover }: ApparatusList.ListHoverState) => any;
  callSnackBarOpenHandler: () => void;
}

const ListEditPageTopName: FC<Props> = (props) => {
  const {
    this_list,
    data,
    callSnackBarOpenHandler,
    getHoverStateByIdHandler,
    changeHoverState,
  } = props;
  const classes = useStyles();
  const [editSetData, setEditSetData] = useState(false);
  const inputName = useRef(null);
  const inputDescription = useRef(null);
  const dispatch = useDispatch();
  const { addateList } = useListActions();
  const {
    toggleListEditableState,
    toggleListAddableState,
  } = useListMetaActions();
  const { getEdibleState, getAddableState } = useListHelpers;
  const is_editable = useSelector(getEdibleState);
  const is_addable = useSelector(getAddableState);

  const getValueFromHTMLElement = (
    ref: React.MutableRefObject<string | null>,
    tag_type: "input" | "textarea"
  ) => ((ref.current as unknown) as HTMLElement).querySelector(tag_type)?.value;

  const setChange = (newListData: ApparatusList.UpdateSetInput[]) => {
    let payload = Object.assign(
      {
        id: Number(this_list?.id),
        mode: "edit",
      },
      ...newListData.map((keyValue: ApparatusList.UpdateSetInput) => ({
        [keyValue.key]: keyValue.value,
      }))
    );
    dispatch(addateList(payload));
  };

  useEffect(() => {}, [this_list, data, callSnackBarOpenHandler]);

  return (
    <Grid container alignItems="center" direction="row" spacing={1}>
      {editSetData ? (
        <Grid item xs={9}>
          <Grid container alignItems="center" direction="row" spacing={1}>
            <Grid item className={classes.gridName}>
              <InputLabel htmlFor="name">Name</InputLabel>
              <OutlinedInput
                id="name"
                ref={inputName}
                required
                defaultValue={this_list?.name ?? data?.getList.name ?? ""}
                className={classes.name}
              />
            </Grid>
          </Grid>
          <Grid container alignItems="center" direction="row" spacing={1}>
            <Grid item className={classes.gridDescription}>
              <InputLabel htmlFor="description">Description</InputLabel>
              <TextField
                id="description"
                ref={inputDescription}
                required
                multiline
                rowsMax={4}
                variant="outlined"
                defaultValue={this_list?.description ?? ""}
                className={classes.description}
              />
            </Grid>
          </Grid>
          <Grid
            container
            justify="space-between"
            alignItems="center"
            direction="row"
            className={classes.gridButtonArea}
            spacing={1}
          >
            <Grid item>
              <Button
                variant="contained"
                startIcon={<Icon>clear</Icon>}
                disableRipple
                disableTouchRipple
                className={classes.cancelEditButton}
                onClick={() => setEditSetData(!editSetData)}
              >
                Cancel Edit
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                endIcon={<Icon>arrow_right</Icon>}
                disableRipple
                disableTouchRipple
                onClick={(e: SyntheticEvent) => {
                  e.preventDefault();
                  setEditSetData(!editSetData);
                  callSnackBarOpenHandler();
                  if (inputName === null || inputDescription === null) return;
                  setChange([
                    {
                      key: "name",
                      value: getValueFromHTMLElement(
                        inputName,
                        "input"
                      ) as string,
                    },
                    {
                      key: "description",
                      value: getValueFromHTMLElement(
                        inputDescription,
                        "textarea"
                      ) as string,
                    },
                  ]);

                  // s_save_list_change({
                  //   variables: { ...l_data, id: getCurrentWS().id },
                  // });
                }}
              >
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Grid item xs={9}>
          <Card
            className={classes.root}
            onMouseEnter={() =>
              changeHoverState({
                id: "list_title",
                is_hover: true,
              })
            }
            onMouseLeave={() =>
              changeHoverState({
                id: "list_title",
                is_hover: false,
              })
            }
          >
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {this_list?.name ?? data?.getList.name ?? ""}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {this_list?.description ?? ""}
              </Typography>
            </CardContent>
            {getHoverStateByIdHandler("list_title")?.is_hover ? (
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  disableRipple
                  disableTouchRipple
                  onClick={() => {
                    setEditSetData(!editSetData);
                    changeHoverState({
                      id: "list_title",
                      is_hover: false,
                    });
                  }}
                >
                  Edit
                </Button>
              </CardActions>
            ) : (
              <></>
            )}
          </Card>
        </Grid>
      )}
      <Grid item xs={3}>
        <FormGroup row>
          <FormControlLabel
            control={
              <Switch
                checked={is_editable}
                onChange={() =>
                  dispatch(toggleListEditableState({ editable: !is_editable }))
                }
                name="editable"
                color="primary"
              />
            }
            label="Edit"
          />
          <FormControlLabel
            control={
              <Switch
                checked={is_addable}
                onChange={() =>
                  dispatch(toggleListAddableState({ is_addable: !is_addable }))
                }
                name="editable"
                color="primary"
              />
            }
            label="Add"
          />
        </FormGroup>
      </Grid>
    </Grid>
  );
};

export { ListEditPageTopName as default };
