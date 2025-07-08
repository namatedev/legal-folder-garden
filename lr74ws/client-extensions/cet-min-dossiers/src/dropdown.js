import Button from '@clayui/button';
import DropDown from '@clayui/drop-down';
import ClayIcon, { ClayIconSpriteContext } from '@clayui/icon';
// import from '@clayui/css';
// import '@clayui/css/lib/css/atlas.css';
// import icons from '@clayui/css/lib/images/icons/icons.svg';
// import icons from '/svg/icons.svg';

const Component = () => {
    const items = [
        {
            children: [
                { id: 2, name: "Apple" },
                { id: 3, name: "Banana" },
                { id: 4, name: "Mangos" }
            ],
            id: 1,
            name: "Fruit"
        },
        {
            children: [
                { id: 6, name: "Potatoes" },
                { id: 7, name: "Tomatoes" },
                { id: 8, name: "Onions" }
            ],
            id: 5,
            name: "Vegetable"
        }
    ];

    const juridictionsJson = {
        "code": 0,
        "status": false,
        "message": null,
        "data": [
            {
                "idJuridiction": 1,
                "nomJuridiction": "محكمة الاستئناف بالرباط"
            },
            {
                "idJuridiction": 12,
                "nomJuridiction": "محكمة الاستئناف  بالدار البيضاء"
            },
            {
                "idJuridiction": 18,
                "nomJuridiction": "محكمة الاستئناف بأكادير"
            },
            {
                "idJuridiction": 48,
                "nomJuridiction": "محكمة الاستئناف بورزازات"
            },
            {
                "idJuridiction": 86,
                "nomJuridiction": "محكمة الاستئناف ببني ملال"
            },
            {
                "idJuridiction": 149,
                "nomJuridiction": "محكمة الاستئناف بمراكش"
            },
            {
                "idJuridiction": 377,
                "nomJuridiction": "محكمة الاستئناف بكلميم"
            },
            {
                "idJuridiction": 62,
                "nomJuridiction": "محكمة الاستئناف بالحسيمة"
            },
            {
                "idJuridiction": 69,
                "nomJuridiction": "محكمة الاستئناف بتازة"
            },
            {
                "idJuridiction": 160,
                "nomJuridiction": "محكمة الاستئناف بمكناس"
            },
            {
                "idJuridiction": 177,
                "nomJuridiction": "محكمة الاستئناف بالرشيدية"
            },
            {
                "idJuridiction": 216,
                "nomJuridiction": "محكمة الاستئناف بالناضور"
            },
            {
                "idJuridiction": 222,
                "nomJuridiction": "محكمة الاستئناف بآسفي"
            },
            {
                "idJuridiction": 249,
                "nomJuridiction": "محكمة الاستئناف بخريبكة"
            },
            {
                "idJuridiction": 258,
                "nomJuridiction": "محكمة الاستئناف بتطوان"
            },
            {
                "idJuridiction": 110,
                "nomJuridiction": "محكمة الاستئناف بفاس"
            },
            {
                "idJuridiction": 253,
                "nomJuridiction": "محكمة الاستئناف بطنجة"
            },
            {
                "idJuridiction": 130,
                "nomJuridiction": "محكمة الاستئناف بالقنيطرة"
            },
            {
                "idJuridiction": 144,
                "nomJuridiction": "محكمة الاستئناف بالعيون"
            },
            {
                "idJuridiction": 232,
                "nomJuridiction": "محكمة الاستئناف بالجديدة"
            },
            {
                "idJuridiction": 241,
                "nomJuridiction": "محكمة الاستئناف بسطات"
            },
            {
                "idJuridiction": 197,
                "nomJuridiction": "محكمة الاستئناف بوجدة"
            }
        ]
    }

    return (
        <ClayIconSpriteContext.Provider value="/o/classic-theme/images/clay/icons.svg">
            <DropDown filterKey="name" trigger={<Button size="sm">Select</Button>} triggerIcon="caret-bottom">
                <DropDown.Search placeholder="Type to filter" />
                <DropDown.ItemList items={juridictionsJson.data}>
                    {item => (<DropDown.Item key={item.nomJuridiction}>{item.nomJuridiction}</DropDown.Item>)}
                </DropDown.ItemList>
                {/* <DropDown.ItemList items={items}>
                {item => (
                    <DropDown.Group
                        header={item.name}
                        items={item.children}
                        key={item.name}
                    >
                        {item => (
                            <DropDown.Item
                                key={item.name}
                                onClick={() => {
                                    // logic stuff...
                                }}
                            >
                                {item.name}
                            </DropDown.Item>
                        )}
                    </DropDown.Group>
                )}
            </DropDown.ItemList> */}
            </DropDown>
        </ClayIconSpriteContext.Provider>
    );
};

export default Component;
// render(<Component />);

