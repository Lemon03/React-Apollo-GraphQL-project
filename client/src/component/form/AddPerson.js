import Title from "../layout/Title";
import { Divider, Form, Input, Button } from 'antd'
import { useMutation } from '@apollo/client'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { ADD_PERSON, GET_PEOPLE } from '../../graphql/Query.js'

export default function AddPerson() {
    const [id] = useState(uuidv4())
    const [form] = Form.useForm()
    const [, forceUpdate] = useState()
  
    const [addPerson] = useMutation(ADD_PERSON)
  
    useEffect(() => {
      forceUpdate({})
    }, [])

    const onFinish = values => {
        const { firstName, lastName } = values
    
        addPerson({
          variables: {
            id,
            firstName,
            lastName
          },
          update: (cache, { data: { addPerson } }) => {
            const data = cache.readQuery({ query: GET_PEOPLE })
            cache.writeQuery({
              query: GET_PEOPLE,
              data: {
                ...data,
                people: [...data.people, addPerson]
              }
            })
          }
        })
    }

    return (
        <div style={{marginBottom:20}}>
            <Divider>
                <Title content={"Add Person"} />
            </Divider>  
            <Form 
                className="add-person"
                layout="inline"
                size="large"
                style={{justifyContent: 'center'}}
                form={form}
                onFinish={onFinish}
            >
                <Form.Item
                    label="First Name"
                    name="firstName"
                    rules={[{required:true, message: 'Enter First Name'}]}
                >
                    <Input placeholder="First Name"/>
                </Form.Item>
                <Form.Item
                    label="Last Name"
                    name="lastName"
                    rules={[{required:true, message: 'Enter Last Name'}]}
                >
                    <Input placeholder="Last Name"/>
                </Form.Item>
                <Form.Item shouldUpdate={true}>
                    {() => (
                    <Button
                        type='primary'
                        htmlType='submit'
                        disabled={
                        !form.isFieldsTouched(true) ||
                        form.getFieldsError().filter(({ errors }) => errors.length).length
                        }
                    >
                        Add Contact
                    </Button>
                    )}
                </Form.Item>
            </Form>
        </div>
        
    );  
}
