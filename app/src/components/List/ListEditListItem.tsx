import React, { useEffect, useCallback, FC } from "react";
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
import styled from "styled-components";

type TProps = {
  selectable: ApparatusList.Selectable;
  item: Item.Item;
  is_set: boolean;
  callSnackBarOpenHandler: () => void;
};

const ListEditListItem: FC<TProps> = (props) => {
  const { selectable, item, is_set } = props;
  const { is_selectable, add, remove, selected } = selectable;
  const classes = useStyles();

  const history = useHistory();
  let is_selected = selected?.items.includes(item?.id);

  const goToItem = useCallback(() => history.push(`/item_edit/${item.id}`), [
    item,
  ]);

  const pressCheckBoxHandler = useCallback((e) => {
    const is_checked = e.target.checked;
    const id = e.target.value;
    const add_to = "items" as "items";
    if (is_checked === true && add !== undefined) {
      add({ id, add_to });
    } else if (is_checked === false && remove !== undefined) {
      remove({ id, add_to });
    }
  }, []);

  const createHighlight = (): HTMLSpanElement => {
    let highlight = document.createElement("span");
    highlight.setAttribute("class", "highlight-red");
    return highlight;
  };

  const extractTexts = (childNodes: NodeListOf<ChildNode>): string =>
    Array.prototype.reduce.call(
      childNodes,
      (result, node) =>
        result + ((node.innerHTML ?? "") || (node.nodeValue ?? "")),
      ""
    ) as string;

  const highlightText = useCallback(() => {
    let range = window.getSelection();
    const selectedRange = range?.getRangeAt(0);
    if (
      !(
        selectedRange?.commonAncestorContainer?.nodeName === "#text" ||
        (selectedRange?.commonAncestorContainer as HTMLElement).className?.includes(
          "highlightable"
        )
      )
    ) {
      return;
    }

    const domFragment = selectedRange?.extractContents();
    if (domFragment?.childNodes.length === 0) return;

    const highlight = createHighlight();
    highlight.innerHTML = extractTexts(domFragment?.childNodes!);
    selectedRange?.insertNode(highlight!);

    Array.from(document.querySelectorAll("span.highlight-red")).forEach(
      (element: any) => {
        if (element.querySelector("span.highlight-red") !== null)
          element.innerHTML = extractTexts(element.childNodes!);
        if (element.innerHTML === "") element.remove();
      }
    );
  }, []);

  useEffect(() => {}, [props]);

  return (
    <Card className={classes.root}>
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
            // onClick={is_set ? () => {} : goToItem}
            style={{ cursor: "pointer" }}
          >
            <Typography gutterBottom variant="subtitle1" component="h4">
              {item?.data ?? ""}
            </Typography>
            <Typography
              className={"highlightable"}
              variant="body2"
              color="textPrimary"
              component="p"
              onMouseUp={highlightText}
            >
              {item.description}
            </Typography>
            <Divider />
            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
              style={{ marginTop: 5 }}
            >
              {item.note ?? ""}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export { ListEditListItem as default };
