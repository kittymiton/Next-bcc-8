"use Client";

import { Category } from "@/_types/Category";
import { Box, Chip, FormControl, MenuItem, OutlinedInput, Select } from "@mui/material";
import { getStyles } from "../_utils/getStyles";
import { theme } from "../_utils/theme";

type Selected = {
  categories: Category[];
  selectedCategories: Category[];
  setSelectedCategories: (categories: Category[]) => void;
};

// カテゴリ選択解除する関数
export const CategoriesSelect: React.FC<Selected> = ({ categories, selectedCategories, setSelectedCategories }) => {
  const handleChange = (value: number[]) => {
    value.forEach((valueId: number) => {
      const isSelect = selectedCategories.some((category) => category.id === valueId);
      if (isSelect) {
        setSelectedCategories(selectedCategories.filter((category) => category.id !== valueId));
        return;
      }
      const category = categories.find((category) => category.id === valueId);
      if (!category) return;
      setSelectedCategories([...selectedCategories, category]);
    });
  };

  return (
    <FormControl sx={{ width: 500 }}>
      <Select
        className="w100"
        multiple // multipleは選択された値を配列として渡す
        value={selectedCategories}
        // 各選択アクションのたびに選択された項目が配列として管理
        onChange={(e) => handleChange(e.target.value as unknown as number[])} // 最初にunknownに変換し任意の型に変換するための中間ステップを作りnumber[]型に再度変換
        input={<OutlinedInput />} // 入力フィールドがフォーカスされたときにアウトラインが強調されるデザイン
        renderValue={(selected: Category[]) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((category: Category) => (
              <Chip key={category.id} label={category.name} /> // タグやカテゴリの表示、選択された項目の表示 見た目は小さなバッジやラベルのよう視覚的な情報を提供
            ))}
          </Box>
        )}
      >
        {categories.map((category) => (
          <MenuItem
            key={category.id}
            value={category.id}
            sx={getStyles(
              category.id,
              selectedCategories.map((category) => category.id),
              theme
            )}
          >
            {category.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
