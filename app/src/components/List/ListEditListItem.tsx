import React, { createRef, RefObject, useCallback, FC } from "react";
import { useHistory } from "react-router-dom";
import { useStyles } from "../../assets/style/list/item.style";
import {
  Card,
  CardContent,
  Checkbox,
  Divider,
  Grid,
  Typography,
} from "@material-ui/core";
import { groupBy } from "../../modules/group";
import * as _ from "lodash";

type TProps = {
  selectable: ApparatusList.Selectable;
  item: Item.Item;
  is_set: boolean;
  is_note_mode: boolean;
  callSnackBarOpenHandler: () => void;
  onMouseUpHandler: ({
    itemId,
    rootRef,
  }: {
    itemId: string;
    rootRef: RefObject<unknown>;
  }) => () => void;
};

const wrapWithHighlight = (
  target: { key: keyof Item.Item; text: string },
  defaultHighlights: {
    [key in keyof Item.Item]: Array<{ start: number; end: number }>;
  }
) => {
  let lastEndIndex = 0;
  let currentText = target.text;
  let nodes: Array<any> = [];
  for (const { start, end } of defaultHighlights[target.key]!) {
    let currentStart = start - lastEndIndex;
    let currentEnd = end - lastEndIndex;
    nodes.push(
      currentText.slice(0, currentStart),
      <span className="highlight-red">
        {currentText.slice(currentStart, currentEnd + 1)}
      </span>
    );
    lastEndIndex = end + 1;
    currentText = currentText.slice(currentEnd + 1, target.text.length);
  }
  nodes.push(currentText);
  return nodes;
};

const ListEditListItem: FC<TProps> = (props) => {
  const { selectable, item, is_note_mode, is_set, onMouseUpHandler } = props;
  const { is_selectable, add, remove, selected } = selectable;
  const classes = useStyles();
  const history = useHistory();
  const rootRef = createRef();
  let is_selected = selected?.items.includes(item?.id);
  const wrapOnMouseUpHandler = onMouseUpHandler({
    itemId: String(item?.id),
    rootRef,
  });
  const defaultHighlights = groupBy(
    _.sortBy(item.highlights!, [(highlight) => highlight.start]),
    "targetType"
  );

  const goToItem = useCallback(() => history.push(`/item_edit/${item.id}`), [
    item,
  ]);

  const pressCheckBoxHandler = useCallback(
    (e) => {
      const is_checked = e.target.checked;
      const id = e.target.value;
      const add_to = "items" as "items";
      if (is_checked === true && add !== undefined) {
        add({ id, add_to });
      } else if (is_checked === false && remove !== undefined) {
        remove({ id, add_to });
      }
    },
    [add, remove]
  );

  const onDoNothing = () => {};

  return (
    <Card className={classes.root} ref={rootRef}>
      <CardContent>
        <Grid container direction="row" spacing={1}>
          {is_selectable ? (
            <Grid item xs={1} style={{ display: "inline-grid" }}>
              <Checkbox
                checked={is_selected}
                color="primary"
                inputProps={{ "aria-label": "secondary checkbox" }}
                style={{ margin: "auto" }}
                size={"small"}
                onChange={pressCheckBoxHandler}
                value={item.id}
              />
            </Grid>
          ) : (
            <></>
          )}
          <Grid
            item
            xs={is_selectable ? 11 : 12}
            onClick={is_set || is_note_mode ? onDoNothing : goToItem}
            style={{ cursor: "pointer" }}
          >
            <Typography
              gutterBottom
              variant="subtitle1"
              component="h4"
              className={"highlightable item-data"}
              onMouseUp={is_note_mode ? wrapOnMouseUpHandler : onDoNothing}
            >
              {item.data
                ? defaultHighlights?.data !== undefined
                  ? wrapWithHighlight(
                      { key: "data", text: item.data! },
                      defaultHighlights
                    ).map((node: any) => node)
                  : item.data
                : ""}
            </Typography>
            <Typography
              variant="body2"
              color="textPrimary"
              component="p"
              className={"highlightable item-description"}
              onMouseUp={is_note_mode ? wrapOnMouseUpHandler : onDoNothing}
            >
              {item.description
                ? defaultHighlights?.description !== undefined
                  ? wrapWithHighlight(
                      { key: "description", text: item.description! },
                      defaultHighlights
                    ).map((node: any) => node)
                  : item.description
                : ""}
            </Typography>
            <Divider />
            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
              style={{ marginTop: 5 }}
              className={"highlightable item-note"}
              onMouseUp={is_note_mode ? wrapOnMouseUpHandler : onDoNothing}
            >
              {item.note
                ? defaultHighlights?.note !== undefined
                  ? wrapWithHighlight(
                      { key: "note", text: item.note! },
                      defaultHighlights
                    ).map((node: any) => node)
                  : item.note
                : ""}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export { ListEditListItem as default };
