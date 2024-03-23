import MainBody from '../components/MainBody'
import Navbar from '../components/Navbar'
import Card from '../components/Card'
import { useState, useEffect } from 'react'
import getApiData from '../data/getApiData'
import Spinner from '../components/Spinner'
import Button from '../components/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import Modal from '../components/Modal'
import { updateReport } from '../data/reportUpdate'

export default function Reports() {
    const [reports, setReports] = useState(null)
    const [selected, setSelected] = useState(null)
    useEffect(() => {
        async function getReports() {
            const { report } = await getApiData('/admin/report')
            setReports(report)
        }
        getReports()
    }, [])

    return (
        <div className="w-full flex">
            <Navbar active={'Dashboard'} type="admin" />
            <MainBody>
                <h1 className="font-bold text-3xl p-2">Reports</h1>
                <Card className="min-h-[400px] p-8 grid grid-cols-1 sm:w-full w-full sm:h-auto h-full  text-left content-start">
                    {!reports && (
                        <div className="h-full w-full">
                            <Spinner />
                        </div>
                    )}
                    {reports && reports.length > 0 && (
                        <div className="grid md:grid-cols-4 grid-cols-3">
                            <div className="font-bold p-2">Location</div>
                            <div className="font-bold p-2">Charger</div>
                            <div className="font-bold p-2">Description</div>
                            <div className="text-center font-bold">Action</div>

                            {reports.map((report, i) => (
                                <div
                                    className={`md:col-span-4 col-span-3 grid md:grid-cols-4 grid-cols-3 ${
                                        i % 2 ? 'bg-gray bg-opacity-15' : ''
                                    }`}
                                    key={report.reportID}
                                >
                                    <p className="my-auto p-2">
                                        {report.chargingPoint.location.name}
                                    </p>
                                    <p className="my-auto p-2">
                                        Charger {report.chargerLocationID}
                                    </p>
                                    <p
                                        className="my-auto p-2 text-accent font-semibold hover:cursor-pointer"
                                        onClick={() =>
                                            setSelected(report.reportID)
                                        }
                                    >
                                        View Description
                                    </p>
                                    {selected === report.reportID && (
                                        <div className="fixed top-0 left-0 ">
                                            <Modal
                                                setOpen={() => {
                                                    setSelected(null)
                                                }}
                                            >
                                                <div className="flex flex-col h-full justify-between items-center align-middle">
                                                    <p>
                                                        Charger{' '}
                                                        {
                                                            report.chargerLocationID
                                                        }
                                                    </p>
                                                    <div className="w-4/5 overflow-auto border-2 h-full rounded-md mt-4">
                                                        <p>{report.message}</p>
                                                    </div>
                                                    <div className="w-4/5 flex mx-auto my-2">
                                                        <Button
                                                            color="GREEN"
                                                            onClick={() =>
                                                                updateReport({
                                                                    chargingPointID:
                                                                        report.chargingPointID,
                                                                })
                                                            }
                                                        >
                                                            {' '}
                                                            Mark as broken{' '}
                                                            <FontAwesomeIcon
                                                                icon={faCheck}
                                                            />
                                                        </Button>
                                                        <Button
                                                            color="RED"
                                                            onClick={() =>
                                                                updateReport({
                                                                    reportID:
                                                                        report.reportID,
                                                                })
                                                            }
                                                        >
                                                            Ignore{' '}
                                                            <FontAwesomeIcon
                                                                icon={faXmark}
                                                            />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Modal>
                                        </div>
                                    )}
                                    <div className="p-4">
                                        <div className="w-1/2 flex mx-auto ">
                                            <Button
                                                color="GREEN"
                                                onClick={() =>
                                                    updateReport({
                                                        chargingPointID:
                                                            report.chargingPointID,
                                                    })
                                                }
                                            >
                                                {''}
                                                <FontAwesomeIcon
                                                    icon={faCheck}
                                                />
                                            </Button>
                                            <Button
                                                color="RED"
                                                onClick={() =>
                                                    updateReport({
                                                        reportID:
                                                            report.reportID,
                                                    })
                                                }
                                            >
                                                {''}
                                                <FontAwesomeIcon
                                                    icon={faXmark}
                                                />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {reports && reports.length === 0 && (
                        <p className="my-auto text-center mx-auto">
                            No reports to display at this time. If a user
                            submits a report about a broken charger it will
                            appear here.
                        </p>
                    )}
                </Card>
            </MainBody>
        </div>
    )
}
