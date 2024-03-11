import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import numericalSuffix from '../data/numericSuffix'
import Button from './Button'
import Card from './Card'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

export default function Modal({ location, setOpen }) {
    const handleChildElementClick = (e) => {
        if (e.target.type !== 'submit') {
            e.stopPropagation()
        }
    }

    const exit = () => {
        setOpen(false)
    }
    return (
        <div
            className="w-screen h-screen absolute bg-black bg-opacity-70 flex items-center justify-center top-0 left-0"
            onClick={() => exit()}
        >
            <Card
                className="w-full sm:w-3/4 md:w-3/5 lg:w-1/2 xl:w-2/5 h-full sm:h-auto sm:aspect-video rounded-md p-10 sm:p-6 text-lg font-semibold "
                onClick={(e) => handleChildElementClick(e)}
            >
                <FontAwesomeIcon
                    icon={faXmark}
                    className="float-right hover:text-gray lg:text-lg"
                    onClick={() => exit()}
                />
                <div className="flex flex-col justify-evenly h-full">
                    <div>
                        <h1 className="text-xl font-bold">
                            Are you sure you want to leave the queue?
                        </h1>
                        <h2 className="mt-4 ">
                            {location.name}
                            <span className="text-gray">
                                {' '}
                                - {location.wattage}kWh
                            </span>
                        </h2>
                        <p className="mt-4 text-accent">
                            Queue Position: {numericalSuffix(location.position)}
                        </p>
                    </div>
                    <div className="flex w-full sm:flex-row flex-col p-2 justify-center">
                        <Button
                            id="button"
                            color="GREEN"
                            className="sm:w-1/3 w-full m-2"
                        >
                            Leave Queue
                        </Button>
                        <Button
                            id="button"
                            color="WHITE"
                            className="sm:w-1/3 w-full m-2"
                            onClick={() => {
                                exit()
                            }}
                        >
                            Go back
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}
