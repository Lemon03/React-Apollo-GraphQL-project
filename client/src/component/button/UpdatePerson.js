import { EditOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/client'
import { useEffect, useState } from 'react'
import { UPDATE_PERSON } from '../../graphql/Query'
import { Form, Input, Modal, Button } from 'antd';


export default function UpdatePerson({ id, firstName, lastName }) {
    const [form] = Form.useForm()
    const [, forceUpdate] = useState()

    useEffect(() => {
        forceUpdate({})
    }, [])

    const [UpdatePerson] = useMutation(UPDATE_PERSON)

    const onFinish = values => {
        const updateVariables = {
          id,
          ...values.firstName && { firstName: values.firstName },
          ...values.lastName && { lastName: values.lastName }
        };
        
        UpdatePerson({ variables: updateVariables });
    }
      

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        form.submit();
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <EditOutlined twoToneColor="#FF0000" key="delete" onClick={showModal}/>
            <Modal 
                title="Update Person's Name" 
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
                    initialValues={{
                        firstName,
                        lastName
                    }}
                    style={{flex:2, gap: 10, justifyContent: 'center'}}
                    >
                    <Form.Item
                        name='firstName'
                        label="First Name"
                        rules={[{ required: false, message: 'Enter a first name' }]}
                    >
                        <Input placeholder='First Name' />
                    </Form.Item>
                    <Form.Item 
                        name='lastName' 
                        label="Last Name"
                        rules={[{ required: false, message: 'Enter a last name' }]}
                    >
                        <Input placeholder='Last Name' />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}


