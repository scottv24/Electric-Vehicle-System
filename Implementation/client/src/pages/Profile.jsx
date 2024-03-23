import { useState } from 'react'
import Button from '../components/Button'
import MainBody from '../components/MainBody'
import Navbar from '../components/Navbar'
import Spinner from '../components/Spinner'
import Modal from '../components/Modal'
import { logout, deleteAccount } from '../data/login'

export default function Profile() {
    const [deletingAccount, setDeleteAccount] = useState(false)
    return (
        <div className="w-full flex">
            <Navbar active={'Queues'} type="client" />
            <MainBody>
                <h1 className="font-bold text-3xl p-2 w-full">Profile</h1>
                <div className="h-2/3 flex flex-col items-center justify-center">
                    <Button
                        color="RED"
                        className="my-4"
                        onClick={() => logout()}
                    >
                        Log Out
                    </Button>
                    <Button
                        color="RED"
                        onClick={() => setDeleteAccount(true)}
                        className="my-4"
                    >
                        Delete Account
                    </Button>
                </div>
                {deletingAccount && (
                    <Modal setOpen={setDeleteAccount}>
                        <div className="h-full flex flex-col items-center justify-center">
                            <p>Are you sure you want to delete your account?</p>
                            <Button
                                color="GREEN"
                                className="my-4"
                                onClick={() => deleteAccount()}
                            >
                                Yes
                            </Button>
                            <Button
                                color="RED"
                                onClick={() => setDeleteAccount(false)}
                            >
                                No
                            </Button>
                        </div>
                    </Modal>
                )}
            </MainBody>
        </div>
    )
}
