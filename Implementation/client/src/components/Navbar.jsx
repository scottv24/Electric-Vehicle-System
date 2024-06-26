import { NavbarInfo } from '../data/navbars'
import Logo from './Logo'
import NavbarLink from './NavbarLink'
import { useState, useEffect } from 'react'
import getApiData from '../data/getApiData'
import { adminCheck } from '../data/login'
import { faUserGear } from '@fortawesome/free-solid-svg-icons'

export default function Navbar({ active, type }) {
    const [reportCount, setReportCount] = useState(null)
    const [isAdmin, setIsAdmin] = useState(false)

    const fields = NavbarInfo[type]
    const theme = `${type}-theme`

    useEffect(() => {
        async function getReportCount() {
            const { count } = await getApiData('admin/report-count')
            console.log(count)
            setReportCount(count)
        }

        async function checkAdmin() {
            const isAdmin = await adminCheck()
            setIsAdmin(isAdmin)
        }

        if (type === 'admin') {
            getReportCount()
        } else {
            checkAdmin()
        }
    }, [])

    return (
        <>
            <div
                className={`${
                    type === 'admin' ? 'admin-theme' : ''
                } sm:flex flex-col items-center bg-nav-standard shadow h-full lg:w-1/5 md:w-1/4 w-1/5 hidden`}
            >
                <div className="justify-center flex items-center w-full p-6">
                    <Logo hw={false} />
                </div>
                <hr className="text-nav-primary p-2 w-4/5" />
                <ul className="w-4/5 self-end">
                    {fields &&
                        fields.map((field) => (
                            <NavbarLink
                                field={field}
                                active={field.name === active}
                                key={field.name}
                                reportCount={reportCount}
                            />
                        ))}
                    {isAdmin && (
                        <NavbarLink
                            field={{
                                name: 'Admin Site',
                                path: 'admin',
                                icon: faUserGear,
                            }}
                            active={false}
                            key={'admin'}
                            reportCount={reportCount}
                        />
                    )}
                </ul>
            </div>
            <div className="sm:hidden fixed bottom-0 h-[7.5%] p-0 w-full bg-white shadow-2xl shadow-black flex justify-between items-center align-middle">
                {fields &&
                    fields.map((field) => (
                        <NavbarLink
                            field={field}
                            active={field.name === active}
                            key={field.name}
                            mobile={true}
                        />
                    ))}
            </div>
        </>
    )
}
