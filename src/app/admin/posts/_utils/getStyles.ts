"use client";

// スタイルオブジェクトを生成
export const getStyles = (id: number, selectedIds: number[], theme: any) => {
  return {
    fontWeight: selectedIds.indexOf(id) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightBold,
    backgroundColor: selectedIds.indexOf(id) !== -1 ? theme.palette.action.selected : "transparent",
  };
};
