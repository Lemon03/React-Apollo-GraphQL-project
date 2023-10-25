import { DeleteTwoTone } from '@ant-design/icons';
import { useMutation } from '@apollo/client'
import { GET_CAR, REMOVE_CAR, PERSON_WITH_CAR } from '../../graphql/Query'
import { filter } from 'lodash'
import { Popconfirm } from 'antd'
import { useApolloClient } from '@apollo/client';


export default function DeleteCar({ id }) {
    console.log(id);
    const client = useApolloClient();

    const [removeCar] = useMutation(REMOVE_CAR, {
        update(cache, { data: { removeCar } }) {
          const { car } = cache.readQuery({ query: GET_CAR, variables: { personId: removeCar.personId }})
          cache.writeQuery({
            query: GET_CAR,
            variables: { personId: removeCar.personId },
            data: {
              car: filter(car, c => {
                return c.id !== removeCar.id
              })
            }
          })
          console.log("removeCar.personId 1", removeCar.personId)
        }
    })

    const confirmPopup = async (e) => {
      const { data: { removeCar: removedCarDetails } } = await removeCar({
          variables: {
            id
          }
      });
      
      console.log("removedCarDetails.personId", removedCarDetails.personId);
      await client.refetchQueries({
          include: [
            { query: GET_CAR, variables: { personId: removedCarDetails.personId } },
            { query: PERSON_WITH_CAR, variables: { personId: removedCarDetails.personId } }
          ]
      });
    };
  

    const cancelPopup = (e) => {
        console.log(e);
    };
      
    return (
        <div>
            <Popconfirm
                title="Delete"
                description="Are you sure to delete this car?"
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


