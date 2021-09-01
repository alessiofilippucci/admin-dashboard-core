import * as React from 'react';
import { Box, Typography, List } from '@material-ui/core';
import { useTranslate } from 'admin-dashboard-core';

/**
 * Header and container for a list of filter list items
 *
 * Expects 2 props, and a list of <FilterListItem> as children:
 *
 * - label: The label for this filter section. Will be translated.
 * - icon: An icon react element
 *
 * @see FilterListItem
 *
 * @example
 *
 * import * as React from 'react';
 * import { Card, CardContent } from '@material-ui/core';
 * import MailIcon from '@material-ui/icons/MailOutline';
 * import { FilterList, FilterListItem } from 'react-admin';
 *
 * const FilterSidebar = () => (
 *     <Card>
 *         <CardContent>
 *             <FilterList
 *                 label="Subscribed to newsletter"
 *                 icon={<MailIcon />}
 *             >
 *                 <FilterListItem
 *                     label="Yes"
 *                     value={{ has_newsletter: true }}
 *                  />
 *                 <FilterListItem
 *                     label="No"
 *                     value={{ has_newsletter: false }}
 *                  />
 *             </FilterList>
 *         </CardContent>
 *     </Card>
 * );
 */
const FilterList = ({
    label,
    icon,
    children,
}) => {
    const translate = useTranslate();
    return (
        <>
            <Box mt={2} display="flex" alignItems="center">
                <Box mr={1}>{icon}</Box>
                <Typography variant="overline">{translate(label)}</Typography>
            </Box>
            <List dense disablePadding>
                {children}
            </List>
        </>
    );
};

export default FilterList;
