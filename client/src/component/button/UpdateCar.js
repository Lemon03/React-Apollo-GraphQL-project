import { EditOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/client'
import { useEffect, useState } from 'react'
import { GET_PEOPLE, UPDATE_CAR, GET_CAR, PERSON_WITH_CAR } from '../../graphql/Query'
import { Form, Input, Modal, Button, Space, Dropdown, InputNumber } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useQuery } from '@apollo/client'


export default function UpdateCar({ id, year, model, make, price, personId }) {
    
    const [form] = Form.useForm()
    const [, forceUpdate] = useState()
    const [selectedPerson, setSelectedPerson] = useState('');
    const [selectedPersonId, setSelectedPersonId] = useState('');

    useEffect(() => {
        forceUpdate({})
    }, [])

    const [UpdateCar] = useMutation(UPDATE_CAR, {
        update: (cache, { data: { updateCar } }) => {
            if (personId !== selectedPersonId) {
                console.log("Checking personId:", personId);
                const originalPersonData = cache.readQuery({
                    query: GET_CAR,
                    variables: { personId: personId }
                });
        
                if (originalPersonData) {
                    const filteredCars = originalPersonData.car.filter(car => car.id !== updateCar.id);
                    cache.writeQuery({
                        query: GET_CAR,
                        variables: { personId: personId },
                        data: { car: filteredCars }
                    });
                    console.log("filteredCars",filteredCars)
                }
        
                const newPersonData = cache.readQuery({
                    query: GET_CAR,
                    variables: { personId: selectedPersonId }
                });
        
                if (newPersonData) {
                    const newCarsList = [...newPersonData.car, updateCar];
        
                    cache.writeQuery({
                        query: GET_CAR,
                        variables: { personId: selectedPersonId },
                        data: { car: newCarsList }
                    });
                    console.log("newCarsList", newCarsList)
                }
        }}
    });
    
    
      
    const onFinish = values => {
        console.log("onFinish triggered");
        const updateVariables = {
          id,
          year: parseInt(values.year, 10),
          make: values.make,
          model: values.model,
          price: parseFloat(values.price),
          personId: selectedPersonId
        };
        
        console.log("Updating car", updateVariables);
        UpdateCar({ 
            variables: updateVariables,
            refetchQueries: [
                { query: GET_CAR, variables: { personId: personId } },
                { query: GET_CAR, variables: { personId: selectedPersonId } },
                { query: PERSON_WITH_CAR, variables: { personId: selectedPersonId } },
                { query: PERSON_WITH_CAR, variables: { personId: personId } },
            ]
        }).catch(error => {
            console.error("Error mutation:", error);
        });              
    }

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        console.log('Year data type:', typeof year);
        console.log('Price data type:', typeof price);
        form.submit();
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const { error, data, loading } = useQuery(GET_PEOPLE)
    if (loading) return 'Loading...';
    if (error) return `${error.message}`

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
        <div>
            <EditOutlined twoToneColor="#FF0000" key="delete" onClick={showModal}/>
            <Modal 
                title="Update Car's Info" 
                open={isModalOpen} 
                onOk={handleOk} 
                onCancel={handleCancel}
                style={{flexDirection:'column', justifyContent: 'center', alignItems: 'center'}}
                footer={[
                    <div style={{ textAlign: 'center', width: '100%' }}>
                        <Button key="back" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button key="submit" type="primary" onClick={handleOk}>
                            Confirm
                        </Button>
                    </div>
                ]}
            >
                <Form
                    form={form}
                    name='update-contact-form'
                    layout='inline'
                    onFinish={onFinish}
                    onFinishFailed={(errorInfo) => console.error('Failed:', errorInfo)}
                    initialValues={{
                        year,
                        model,
                        make,
                        price, 
                        personId
                    }}
                    style={{flex:2, gap: 10, justifyContent: 'center'}}
                    >
                    <Form.Item
                        label="Year"
                        name="year"
                        // rules={[{ message: 'Enter Year'}]}
                    >
                        <InputNumber placeholder="Year"/>
                    </Form.Item>
                    <Form.Item
                        label="Make"
                        name="make"
                        // rules={[{ message: 'Enter Make'}]}
                    >
                        <Input placeholder="Make"/>
                    </Form.Item>
                    <Form.Item
                        label="Model"
                        name="model"
                        // rules={[{ message: 'Enter Model'}]}
                    >
                        <Input placeholder="Model"/>
                    </Form.Item>
                    <Form.Item
                        label="Price"
                        name="price"
                        // rules={[{ message: 'Enter Price'}]}
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
                </Form>
            </Modal>
        </div>
    );
}


