import MainBody from '../components/MainBody'
import Navbar from '../components/Navbar'
import Card from '../components/Card'
import Spinner from '../components/Spinner'
import getApiData from '../data/getApiData'
import AdminTable from '../components/AdminTable'
import { useState, useEffect } from 'react'
import AdminTableUsers from '../components/AdminTableUsers'
import Axios from 'axios'
export default function AdminConsole() {
    const [accounts, setAccount] = useState(null)
    const [selectedAccount, setSelectedAccount] = useState(null)
    const adding = null
    useEffect(() => {
        async function getUsers() {
            const { admins } = await getApiData('admin/get-admin-users')
            if (admins) {
                setAccount(admins)
                console.log(admins.length)
            }
            return
        }
        getUsers()
    }, [])

    return (
        <div className="w-full flex bg-bg">
            <Navbar active={'Admin Console'} type="admin" />
            <MainBody>
                <Spinner enabled={!accounts} />
                {accounts && (
                    <Card className="min-h-[400px] sm:w-full w-full sm:h-full sm:h-auto overflow-auto">
                        <h1 className="w-full col-span-full mt-0 text-3xl font-bold flex justify-center items-center">
                            Charging Locations
                        </h1>
                        <div className="p-4  grid-cols-4 h-full">
                            <button
                                className="w-full hover: border-black bg-accent py-2 text-white text-bold rounded-l rounded-r align-right"
                                onClick={() => {}}
                            >
                                Add New Admin
                            </button>
                            {!selectedAccount ? (
                                <AdminTableUsers
                                    accounts={accounts}
                                    setSelectedAccount={setSelectedAccount}
                                    selectedAccount={selectedAccount}
                                ></AdminTableUsers>
                            ) : (
                                <div className="p-5 columns-2 h-full;">
                                    <div>
                                        <h2 className="text-xl p-5">
                                            Selected User
                                        </h2>
                                        <p className="p-5 text-xl">
                                            {selectedAccount.email}
                                        </p>
                                        <button
                                            className="col-start-2 text-xl p-5"
                                            onClick={() => {
                                                setSelectedAccount(null)
                                            }}
                                        >
                                            Cancel Action
                                        </button>
                                        <button
                                            className="col-start-2 text-xl p-5"
                                            onClick={() => {
                                                RemoveAdmin(
                                                    selectedAccount.email
                                                )
                                            }}
                                        >
                                            Remove Admin
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                )}
            </MainBody>
        </div>
    )
}

async function RemoveAdmin(email) {
    console.log('Entered RemoveAdmin')
    console.log(email)
    const user = 'USER'
    const body = { email, user }
    const response = await Axios.post(
        'http://localhost:3000/api/admin/set-permission-level',
        body,
        {}
    )
    return
}
async function AddAdmin(email) {
    return
}
