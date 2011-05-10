function getSelectedOption(selectId)
{
    var select_list_field = document.getElementById(selectId);
    var select_list_selected_index = select_list_field.selectedIndex;
    var option = select_list_field[select_list_selected_index];
    return option.dataset;
}
