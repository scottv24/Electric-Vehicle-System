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
    const [adding, setNotAdding] = useState(null)
    const [updated, setUpdated] = useState(true)
    useEffect(() => {
        async function getUsers() {
            const { admins } = await getApiData('admin/get-admin-users')
            if (admins) {
                setAccount(admins)
            }
            return
        }
        if (!updated) {
            getUsers()
        } else {
            setUpdated(false)
        }
    }, [updated])

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
                            {!adding ? (
                                <button
                                    className="w-full hover: border-black bg-accent py-2 text-white text-bold rounded-l rounded-r align-right"
                                    onClick={() => {
                                        setNotAdding(true)
                                    }}
                                >
                                    Add New Admin
                                </button>
                            ) : (
                                <div>
                                    <button
                                        className="w-1/2 hover: border-black bg-accent py-2 text-white text-bold rounded-l rounded-r align-right"
                                        onClick={() => {
                                            setNotAdding(null)
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="w-1/2 hover: border-black bg-accent py-2 text-white text-bold rounded-l rounded-r align-right"
                                        onClick={async () => {
                                            await AddAdmin(
                                                document.getElementById(
                                                    'userEmail'
                                                ).value
                                            )
                                            setUpdated(true)
                                            setNotAdding(null)
                                        }}
                                    >
                                        Update
                                    </button>
                                    <label class="align-left">
                                        Enter Email:{' '}
                                    </label>
                                    <input
                                        class=" w-3/4 rounded-md border-2 p-0 sm:text-sm"
                                        name="userEmail"
                                        type="text"
                                        id="userEmail"
                                    ></input>
                                </div>
                            )}
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
                                                setSelectedAccount(null)
                                                setUpdated(true)
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
    const permissionLevel = 'USER'
    const body = { email, permissionLevel }
    const response = await Axios.patch(
        'http://localhost:3000/api/admin/set-permission-level',
        body,
        {}
    )
    return
}
async function AddAdmin(email) {
    const permissionLevel = 'ADMIN'
    const body = { email, permissionLevel }
    const response = await Axios.patch(
        'http://localhost:3000/api/admin/update-location',
        body,
        {}
    )
    return
}
