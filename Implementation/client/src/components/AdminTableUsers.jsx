export default function AdminTableUsers({
    accounts,
    setSelectedAccount,
    selectedAccount,
}) {
    return (
        <table className="divide-y divide-solid table-auto w-full">
            <thead>
                <tr>
                    <th className="text-left px-4 py-2">Email</th>
                    <th className="px-4 py-2">Level</th>
                </tr>
            </thead>

            <tbody className="divide-y divide-solid">
                {accounts.map((accounts) => (
                    <Populate
                        accounts={accounts}
                        setSelectedAccount={setSelectedAccount}
                    />
                ))}
            </tbody>
        </table>
    )
}

function Populate({ accounts, setSelectedAccount }) {
    const { email } = accounts
    console.log('test123')
    return (
        <tr className="divide-solid bg-bg2 p-4">
            <td className="p-5 font-bold">
                <p
                    className="align-left cursor-pointer text-accent"
                    onClick={() => {
                        setSelectedAccount(accounts)
                    }}
                >
                    {email}
                </p>
            </td>
            <td className="p-5">
                <p className="text-center">Admin</p>
            </td>
        </tr>
    )
}
