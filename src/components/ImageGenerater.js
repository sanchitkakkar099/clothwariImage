import React, { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import Select from "react-select";
import { Plus, X } from 'react-feather';
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Form, Input, Label, Row } from 'reactstrap';
import imagepath from '../images/MicrosoftTeams-image (4).png'
import { pdfGenerator } from "../utils/pdfGenerator";

function ImageGenerater() {
    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            image_data: [{ firstimage: "", secondimage: "", thirdimage: "" }],
        },
    });

    const { fields, append, remove } = useFieldArray({ control, name: "image_data" });

    const [imagePreviews, setImagePreviews] = useState({});
    const [imageNames, setImageNames] = useState({});
    const [rowBackgrounds, setRowBackgrounds] = useState({});
    const [rowImageName, setRowImageName] = useState({});

    useEffect(() => {
        console.log("imageNames", imageNames)
    }, [imageNames])

    useEffect(() => {
        console.log("rowBackgrounds", rowBackgrounds)
    }, [rowBackgrounds])

    const handleImageChange = (e, fieldId) => {
        console.log("e",e)
        if (e.target.files && e.target.files[0]) {
            const imageName = e.target.files[0].name; 
            console.log("Image name:", imageName.split('.')[0]);
            setImageNames(prev => ({ ...prev, [fieldId]: imageName.split('.')[0]}));   
        }
        const file = e.target.files[0];
        if (file && file.type.startsWith('image')) {
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreviews(prev => ({ ...prev, [fieldId]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSelectedImage = (fieldId) => { 
        if(!fieldId?.value) return 
        const rowIndex = fieldId?.value.split('.')[1];
        setRowBackgrounds(prev => ({ ...prev, [rowIndex]: imagePreviews[fieldId?.value] }));
        setRowImageName(prev => ({ ...prev, [rowIndex]: imageNames[fieldId?.value] }));
    }

    const handleRemove = index => {
        const newImagePreviews = { ...imagePreviews };
        ['firstimage', 'secondimage', 'thirdimage'].forEach(imgKey => {
            delete newImagePreviews[`${imgKey}.${index}`];
        });
        const newImageNames = { ...imageNames };
        ['firstimage', 'secondimage', 'thirdimage'].forEach(imgKey => {
            delete newImageNames[`${imgKey}.${index}`];
        });

        Object.keys(newImagePreviews).forEach(key => {
            const [imgKey, imgIndex] = key.split('.');
            if (parseInt(imgIndex) > index) {
                const newIndex = parseInt(imgIndex) - 1;
                newImagePreviews[`${imgKey}.${newIndex}`] = newImagePreviews[key];
                delete newImagePreviews[key];
            }
        });
        setImageNames(newImageNames);
        setImagePreviews(newImagePreviews);
        remove(index);
    };

    const onNext = (state) => {
        // console.log("state", state);
    };
    const exportPDF = () => {
        pdfGenerator('pdf', "download.pdf")
    };

    return (
        <Form onSubmit={handleSubmit(onNext)} className='container'>
            <Card>
                <CardHeader>
                    <div className="d-flex justify-content-end">
                        <Button color="primary" onClick={() => append({ firstimage: "", secondimage: "", thirdimage: "" })}>
                            <Plus size={14} />
                            <span className="align-middle ms-25">Add Section</span>
                        </Button>
                    </div>
                </CardHeader>
                <CardBody className='d-flex flex-wrap '>
                    {fields.map((field, index) => (
                        <div className="border-bottom border-dark border-2 pb-1 w-100 d-flex">
                            <Col md={5}>
                                <Row key={field.id} className="justify-content-between align-items-center">
                                    {['firstimage', 'secondimage', 'thirdimage'].map((imgKey, imgIndex) => (
                                        <Col md={12} key={imgIndex}>
                                            <Label className="form-label" htmlFor={`${imgKey}.${index}.title`}>
                                                {`Image ${imgIndex + 1}`}
                                            </Label>
                                            <Controller
                                                id={`${imgKey}.${index}.title`}
                                                name={`${imgKey}.${index}.title`}
                                                control={control}
                                                render={({ field }) => (
                                                    <>
                                                        <Input
                                                            type="file"
                                                            placeholder="Upload Image"
                                                            onChange={(e) => {
                                                                field.onChange(e);
                                                                handleImageChange(e, `${imgKey}.${index}`);
                                                            }}
                                                        />
                                                    </>
                                                )}
                                            />
                                        </Col>
                                    ))}
                                    <Col md="12" sm="12" className="mb-1">
                                        <Label for="role">Image Select</Label>
                                        <Controller
                                            id={`image${index}`}
                                            name={`image${index}`}
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <Select
                                                    isClearable
                                                    options={[
                                                        { label: "Image 1", value: `firstimage.${index}` },
                                                        { label: "Image 2", value: `secondimage.${index}` },
                                                        { label: "Image 3", value: `thirdimage.${index}` },

                                                    ]}
                                                    className="react-select"
                                                    classNamePrefix="select"
                                                    onChange={(selectedOption) => {
                                                        onChange(selectedOption);
                                                        handleSelectedImage(selectedOption);
                                                    }}
                                                    value={value ? value : null}
                                                />
                                            )}
                                        />
                                    </Col>
                                    <Col md={12} className="mb-md-0 mt-4 d-flex justify-content-end">
                                        <Button className="btn-icon" color="danger" outline onClick={() => handleRemove(index)}>
                                            <X size={14} />
                                            <span className="align-middle ms-25"></span>
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                            <Col md={7} style={{ paddingLeft: '1rem', paddingTop: '1rem' }}>
                                <Row key={field.id} className="justify-content-between align-items-center gy-1">
                                    {['firstimage', 'secondimage', 'thirdimage'].map((imgKey, imgIndex) => (
                                        <>
                                            <Col md={6} key={imgIndex} style={{ marginTop: '0px', padding: '2px'}}>
                                                <div>
                                                    {imagePreviews[`${imgKey}.${index}`] && (
                                                        <div className='img-dis'>
                                                        <img src={imagePreviews[`${imgKey}.${index}`]} alt={`Preview ${imgIndex + 1}`} style={{ width: '100%', border: '1px solid black' }} />
                                                        <p>{imageNames[`${imgKey}.${index}`]}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </Col>
                                            {imgIndex === 2 && imagePreviews[`${imgKey}.${index}`] ?
                                                <Col md={6} key={imgIndex + 1} style={{ marginTop: '5px', padding: '2px' }}>
                                                    <div class="c-main_div img-dis">
                                                        <img src={imagepath} alt='' class="c-mask-image" />
                                                        <div class="c-pattern-background-image" style={{
                                                            backgroundImage: `url(${rowBackgrounds[index]})`,
                                                        }}>
                                                       
                                                        </div> 
                                                        <p>{rowImageName[`${index}`]}</p>
                                                    </div>
                                                </Col> : ''}
                                        </>
                                    ))}
                                </Row>
                            </Col>
                        </div>
                    ))}
                    <div id="pdf" style={{ display: "none" }} className='w-100 '>
                        {fields.map((field, index) => (
                            <div className="w-100 d-flex">
                                <Col md={12}    >
                                    <Row key={field.id} className="justify-content-between align-items-center gy-1" style={{ marginTop: '2px', paddingLeft: '11px', paddingRight: '11px' }}>
                                        {['firstimage', 'secondimage', 'thirdimage'].map((imgKey, imgIndex) => (
                                            <>
                                                <Col md={6} key={imgIndex} style={{ marginTop: '0px', padding: '2px' }}>
                                                    <div onClick={(e) => handleSelectedImage(e, `${imgKey}.${index}`)}>
                                                        {imagePreviews[`${imgKey}.${index}`] && (
                                                            <div className='img-dis'>
                                                            <img src={imagePreviews[`${imgKey}.${index}`]} alt={`Preview ${imgIndex + 1}`} style={{ width: '100%', border: '1px solid black' }} />
                                                            <p>{imageNames[`${imgKey}.${index}`]}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </Col>
                                                {imgIndex === 2 && imagePreviews[`${imgKey}.${index}`] ?
                                                    <Col md={6} key={imgIndex + 1} style={{ marginTop: '5px', padding: '2px' }}>
                                                        <div class="c-main_div img-dis">
                                                            <img src={imagepath} alt='' class="c-mask-image" />
                                                            <div class="c-pattern-background-image" style={{
                                                                backgroundImage: `url(${rowBackgrounds[index]})`,
                                                            }}></div>
                                                        <p>{rowImageName[`${index}`]}</p>
                                                        </div>
                                                    </Col> : ''}
                                            </>
                                        ))}
                                    </Row>
                                </Col>
                            </div>
                        ))}
                    </div>
                </CardBody>
                <CardFooter>
                    <div className="d-flex justify-content-end">
                        <Button color="primary" className="me-5" onClick={() => append({ firstimage: "", secondimage: "", thirdimage: "" })}>
                            <Plus size={14} />
                            <span className="align-middle ms-25">Add Section</span>
                        </Button>
                        <Button type="submit" color="primary" onClick={exportPDF} >
                            <span className="align-middle d-sm-inline-block d-none">Create PDF</span>
                        </Button>

                    </div>
                </CardFooter>
            </Card>
        </Form>
    );
}

export default ImageGenerater;
