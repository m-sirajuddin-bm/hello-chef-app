## Your Objective

To implement sorting and filtering on the recipes on the **Weekly Menu** page.

## Resources

1. [Figma Designs](https://www.figma.com/file/KJfwtINPugQt5NNiPzUwDA/Recipe-Filter?node-id=0%3A1)
2. [Figma Prototype](https://www.figma.com/proto/KJfwtINPugQt5NNiPzUwDA/Recipe-Filter?page-id=0%3A1&node[…]ng=contain&starting-point-node-id=1%3A880&show-proto-sidebar=1)

## What to implement from the designs above

1. Mobile design only
2. The "Sort by" feature
3. The "Filters" feature

## What can be skipped

1. Desktop design
2. Direct filters like "Veg/Vegan", "Low Carb" on the main screen
3. Animations
4. "Add" button action
5. Recipe tile design

## Behavior

1. Filter by:

- User can select multiple filters at a time. Filters from the "Main protein" section are applied in "OR" fashion with each other. Filters from the "Recipe Features" section are applied in "OR" fashion with each other. These filters are then applied in "AND" fashion with each other. E.g. ("Chicken" OR "Fish") AND ("Family Friendly" OR "Weekly Classic")
- After applying any filter from the "Main protein" section, the filters from the "Recipe Features" section become enabled/disabled based on the number of available recipes for that combination. E.g. if "Veg/vegan" is selected, and there are no vegetarian gourmet recipes on the menu, then the "Gourmet" filter becomes disabled.

## API

1. Add a new param to the API on the Weekly Menu page.

From this:

```
https://api.hellochef.me/api/weekly-menus/find?by=startDate&value=2022-07-07&withNextWeek=1
```

To this:

```
https://api.hellochef.me/api/weekly-menus/find?by=startDate&value=2022-07-07&withNextWeek=1&with=recipes.mainProtein
```

2. This will return all the recipes with an additional resource like below:

```json
"mainProtein": {
  "id": 3,
  "name": "Fish"
}
```

## Implementation

1. Implement filters using the fields `mainProtein`, `features`, and `weeklyClassic`.
2. Implement sorting using the fields `nutritions` and `cookingTime`.
