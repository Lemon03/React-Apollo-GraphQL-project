import Title from "../layout/Title";
import { Divider, Form, Input, InputNumber, Button, Space, Dropdown } from 'antd'
import { useMutation } from '@apollo/client'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { ADD_CAR, GET_CAR, GET_PEOPLE } from '../../graphql/Query.js'
import { useQuery } from '@apollo/client'
import { DownOutlined } from "@ant-design/icons";

export default function AddCar() {
    const [id] = useState(uuidv4())
    const [form] = Form.useForm()
    const [, forceUpdate] = useState()
    const [selectedPerson, setSelectedPerson] = useState('');
    const [selectedPersonId, setSelectedPersonId] = useState('');

    const [addCar] = useMutation(ADD_CAR)
  
    useEffect(() => {
      forceUpdate({})
    }, [])

    const onFinish = values => {
        const { year, make, model, price, personId } = values
        addCar({
          variables: {
            id, year, make, model, price, personId: selectedPersonId
          },
          update: (cache, { data: { addCar } }) => {
            const existingData = cache.readQuery({ query: GET_CAR, variables: { personId: selectedPerson } });
            if (existingData && existingData.car) {
                cache.writeQuery({
                    query: GET_CAR,
                    variables: { personId: selectedPersonId },
                    data: {
                        car: [...existingData.car, addCar]
                    }
                });
            }},
          refetchQueries: [{ query: GET_CAR, variables: { personId: selectedPersonId } }]     
        })
    }

    const { error, data, loading } = useQuery(GET_PEOPLE)
    if (loading) return 'Loading...';
    if (error) return `${error.message}`

    if (!data.people || data.people.length === 0) return null;

    const items = data.people.map(person => ({
        label: `${person.firstName} ${person.lastName}`,
        value: `${person.firstName} ${person.lastName}`,
        key: person.id,
    }));

    const handleMenuClick = (e) => {
        setSelectedPersonId(e.key)
        setSelectedPerson(e.item.props.value);
    };

    const menuProps = {
        items,
        onClick: handleMenuClick
    };

    return (
        <div style={{marginBottom:20}}>
            <Divider>
                <Title content={"Add Car"} />
            </Divider>  
            <Form 
                className="add-car"
                layout="inline"
                size="large"
                style={{justifyContent: 'center'}}
                form={form}
                onFinish={onFinish}
            >
                <Form.Item
                    label="Year"
                    name="year"
                    rules={[{required:true, message: 'Enter Year'}]}
                    style={{ marginBottom: '20px' }}
                >
                    <InputNumber placeholder="Year" max={new Date().getFullYear()}/>
                </Form.Item>
                <Form.Item
                    label="Make"
                    name="make"
                    rules={[{required:true, message: 'Enter Make'}]}
                    style={{ marginBottom: '20px' }}
                >
                    <Input placeholder="Make"/>
                </Form.Item>
                <Form.Item
                    label="Model"
                    name="model"
                    rules={[{required:true, message: 'Enter Model'}]}
                    style={{ marginBottom: '20px' }}
                >
                    <Input placeholder="Model"/>
                </Form.Item>
                <Form.Item
                    label="Price"
                    name="price"
                    rules={[{required:true, message: 'Enter Price'}]}
                    style={{ marginBottom: '20px' }}
                >
                    <InputNumber placeholder="Price" prefix="$"/>
                </Form.Item>
                <Dropdown menu={menuProps}>
                    <Button>
                        <Space>
                            {selectedPerson || "Select a person"}
                            <DownOutlined />
                        </Space>
                    </Button>
                </Dropdown>
                <Form.Item shouldUpdate={true}>
                    {() => (
                    <Button
                        style={{marginLeft:20}}
                        type='primary'
                        htmlType='submit'
                        disabled={
                        !form.isFieldsTouched(true) ||
                        form.getFieldsError().filter(({ errors }) => errors.length).length
                        }
                    >
                        Add Car
                    </Button>
                    )}
                </Form.Item>
            </Form>
        </div>
        
    );  
}
