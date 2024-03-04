import MainBody from '../components/MainBody'
import Navbar from '../components/Navbar'
import Card from '../components/Card'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'
export default function Admin() {
    console.log('test')
    return (
        <div className="w-full flex bg-bg">
            <Navbar active={'Chargers'} type="admin" />
            <MainBody>
                <Card className="min-h-[400px] p-0 grid grid-cols-4 grid-rows-10 sm:w-full w-full sm:h-auto  gap-4">
                    <button class="col-span-2 row-start-1 row-end-2">
                        Table View
                    </button>
                    <button class="col-span-2 bg-bg2 text-lg hover:bg-white hover:border-2 hover: border-black">
                        Map View
                    </button>
                    <h1 class=" col-span-3 row-start-2 text-center text-3xl font-bold">
                        Charging Locations
                    </h1>
                    <button class="hover:border-2 hover: border-black col-start-4 bg-accent py-2 text-white text-bold rounded-l rounded-r align-right">
                        Edit
                        <FontAwesomeIcon icon={faPen} className="ml-2" />
                    </button>

                    <table class="divide-y divide-solid table-auto col-span-full row-start-4 row-span-full">
                        <thead>
                            <tr>
                                <th class="text-left px-4 py-2">Location</th>
                                <th class="px-4 py-2">No. Chargers</th>
                                <th class="px-4 py-2">Available</th>
                                <th class="px-4 py-2">In Queue</th>
                                <th class="px-4 py-2">Broken</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-solid">
                            <tr class="divide-y divide-solid bg-bg2">
                                <td class="text-left">foo1</td>
                                <td class="text-center">foo2</td>
                                <td class="text-center">foo3</td>
                                <td class="text-center">foo4</td>
                                <td class="text-center">foo5</td>
                            </tr>
                        </tbody>
                    </table>
                </Card>
            </MainBody>
        </div>
    )
}
function User(props) {
    return (
        <tr>
            <td>{props.email}</td>
            <td>{props.registration}</td>
            <td>{props.status}</td>
            <td>...</td>
        </tr>
    )
}
