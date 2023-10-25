import { DeleteTwoTone } from '@ant-design/icons';
import { useMutation } from '@apollo/client'
import { GET_PEOPLE, REMOVE_PERSON } from '../../graphql/Query'
import { filter } from 'lodash'
import { Popconfirm } from 'antd'

export default function DeletePerson({ id }) {
    console.log(id);

    const [removePerson] = useMutation(REMOVE_PERSON, {
        update(cache, { data: { removePerson } }) {
          const { person } = cache.readQuery({ query: GET_PEOPLE })
          cache.writeQuery({
            query: GET_PEOPLE,
            data: {
              people: filter(person, c => {
                return c.id !== removePerson.id
              })
            }
          })
        }
    })

    const confirmPopup = (e) => {
        removePerson({
            variables: {
              id
            },
            refetchQueries: [{ query: GET_PEOPLE }]
        })
       
    };

    const cancelPopup = (e) => {
        console.log(e);
    };
      
    return (
        <div>
            <Popconfirm
                title="Delete"
                description="Are you sure to delete this person?"
                onConfirm={confirmPopup}
                onCancel={cancelPopup}
                okText="Yes"
                cancelText="No"
            >
                <DeleteTwoTone twoToneColor="#FF0000" key="delete"/>
            </Popconfirm>
        </div>
    );
}


