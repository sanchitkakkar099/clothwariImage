import React, { useEffect, useState, useRef } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import Select from "react-select";
import { Plus, X } from 'react-feather';
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Form, Input, Label, Row } from 'reactstrap';
import logo from '../images/logoww (1).jpg'
import imagepath from '../images/MicrosoftTeams-image (15).png'
import { setPageStyle, removePageStyle } from '../utils/customPageSize';
import { useReactToPrint } from "react-to-print";
import axios from 'axios'
import LoaderComponet from "./LoderComponent";

function International() {
    const componentRef = useRef();

    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            image_data: [{ firstimage: "", secondimage: "", thirdimage: "", forthimage: "" }],
        },
    });

    const { fields, append, remove } = useFieldArray({ control, name: "image_data" });

    const [imagePreviews, setImagePreviews] = useState({});
    const [title, setTitle] = useState("");
    const [imageNames, setImageNames] = useState({});
    const [rowBackgrounds, setRowBackgrounds] = useState({});
    const [rowImageName, setRowImageName] = useState({});
    const [loading, setLoading] = useState(false);
    let temp = 0;
    const handleImageChange = async (e, fieldId) => {
        if (e.target.files && e.target.files[0]) {
            const imageName = e.target.files[0].name;
            setImageNames(prev => ({ ...prev, [fieldId]: imageName.split('.')[0] }));
        }
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("file", e.target.files[0]);
        if (file?.type === 'image/tiff' || file?.name?.endsWith('.tif')) {
            setLoading(true);
            try {
                const response = await axios.post('http://65.0.108.107/convert-tiff', formData, {
                    responseType: 'blob'
                });
                setLoading(false);
                const blob = response.data;
                const imageUrl = URL.createObjectURL(blob);
                setImagePreviews(prev => ({ ...prev, [fieldId]: imageUrl }));
            } catch (error) {
                setLoading(false);
                console.log("error", error)
            }
        } else if (file && file.type.startsWith('image')) {
            setLoading(true);
            const reader = new FileReader();

            reader.onload = (e) => {
                if (file.type === 'image/jpeg') {
                    const img = new Image();
                    img.onload = () => {
                        const maxWidth = 2000;
                        const maxHeight = 2000;
                        let { width, height } = img;

                        if (width > height) {
                            if (width > maxWidth) {
                                height = height * (maxWidth / width);
                                width = maxWidth;
                            }
                        } else {
                            if (height > maxHeight) {
                                width = width * (maxHeight / height);
                                height = maxHeight;
                            }
                        }
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        canvas.width = width;
                        canvas.height = height;
                        ctx.drawImage(img, 0, 0, width, height);
                        setImagePreviews(prev => ({ ...prev, [fieldId]: canvas.toDataURL('image/jpeg') }));
                        setLoading(false);
                    };
                    img.src = e.target.result;
                } else {
                    setImagePreviews(prev => ({ ...prev, [fieldId]: e.target.result }));
                    setLoading(false);
                }
            };

            reader.readAsDataURL(file);
        }

    };




    const handleSelectedImage = (fieldId) => {
        if (!fieldId?.value) return
        const rowIndex = fieldId?.value.split('.')[1];
        setRowBackgrounds(prev => ({ ...prev, [rowIndex]: imagePreviews[fieldId?.value] }));
        setRowImageName(prev => ({ ...prev, [rowIndex]: imageNames[fieldId?.value] }));
    }

    const handleRemove = index => {
        const newImagePreviews = { ...imagePreviews };
        ['firstimage', 'secondimage', 'thirdimage', 'forthimage'].forEach(imgKey => {
            delete newImagePreviews[`${imgKey}.${index}`];
        });
        const newImageNames = { ...imageNames };
        ['firstimage', 'secondimage', 'thirdimage', 'forthimage'].forEach(imgKey => {
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

    const getMarginButtom = (temp) =>{
        if(temp===1){
            return '35rem';
        }else if (temp === 2){
            return '18rem';
        }else if( temp === 3){
            return '1rem';
        }
        return 0;
    }
    useEffect(() => {
        setPageStyle("210mm", "238mm");
    }, []);
    const generatePDF = useReactToPrint({
        content: () => componentRef.current,
        onAfterPrint: () => {
        },
        documentTitle: `${title}`,
    });

    return (
        <>
            <Form onSubmit={handleSubmit(onNext)} className='container'>
                <Card>
                    <CardHeader>
                        <div className="d-flex justify-content-between">
                            <div className='mt-1'>
                                International
                            </div>
                            <Button color="primary" onClick={() => append({ firstimage: "", secondimage: "", thirdimage: "", forthimage: "" })}>
                                <Plus size={14} />
                                <span className="align-middle ms-25">Add Section</span>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardBody className='d-flex flex-wrap'>
                        <Input type='text' placeholder='Input Title' onChange={(e) => setTitle(e.target.value)} />
                        {fields.map((field, index) => (
                            <div className="border-bottom border-dark border-2 pb-1 w-100 d-flex">
                                <Col md={5}>
                                    <Row key={field.id} className="justify-content-between align-items-center">
                                        {['firstimage', 'secondimage', 'thirdimage', 'forthimage'].map((imgKey, imgIndex) => (
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
                                                                accept="image/tiff, image/jpeg, image/tif"
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
                                                            { label: "Image 4", value: `forthimage.${index}` },
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
                                {loading ? <LoaderComponet loading /> : " "}
                                <Col md={7} style={{ paddingLeft: '1rem', paddingTop: '1rem' }}>
                                    <Row key={field.id} className="justify-content-between align-items-center gy-1">
                                        {['firstimage', 'secondimage', 'thirdimage', 'forthimage'].map((imgKey, imgIndex) => (
                                            <>
                                                <Col md={6} key={imgIndex} style={{ marginTop: '0px', padding: '2px' }}>
                                                    <div>
                                                        {imagePreviews[`${imgKey}.${index}`] && (
                                                            <div className='img-dis'>
                                                                <img src={imagePreviews[`${imgKey}.${index}`]} alt={`Preview ${imgIndex + 1}`} style={{ width: '100%', border: '1px solid black' }} />
                                                                <p>{imageNames[`${imgKey}.${index}`]}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </Col>
                                                {imgIndex === 0 && imagePreviews[`${imgKey}.${index}`] ?
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
                            <div ref={componentRef}>
                                <div class="container-wrapper c-main-content">
                                    <div class="container text-center">
                                        <div class="row">
                                            <div class="col">
                                                <h1><img src={logo} alt='logo' width='20%'/></h1>
                                                <h1 className='c-text-style'>Digital Print</h1>
                                                <h2 className='c-text-style c-text-style-h2'>{title}</h2>
                                            </div>
                                        </div>
                                    </div>
                                    <span className='c-span_div-bott'></span>
                                </div>
                                {fields.map((field, index) => (
                                    <div className="w-100 d-flex p-1">
                                        <Col md={12} >
                                        {(() => { temp = 0; return null; })()}
                                            <Row key={field.id} className="justify-content-between align-items-center gy-1" style={{ marginTop: '2px', paddingLeft: '11px', paddingRight: '11px' }}>
                                                {['firstimage', 'secondimage', 'thirdimage', 'forthimage'].map((imgKey, imgIndex) => (
                                                    <>
                                                        {imgIndex === 0 && imagePreviews[`${imgKey}.${index}`] ?
                                                            <Col md={12} key={imgIndex + 1} style={{ marginTop: '6px', padding: '2px' }}>
                                                                <div className='text-center fs-1'>Design No: {imageNames[`firstimage.${index}`]}</div>
                                                                <div class="c-main_div img-dis c-a_box_style-2">
                                                                <div className='c-border_style-a c-single_border_style'><span>A</span></div>
                                                                <div className='c-box-item-3' >
                                                                    <div  style={{ border: '2px solid black' }}>
                                                                        <img src={imagepath} alt='' class="c-mask-image" />
                                                                        <div class="c-pattern-background-image c-pattern_back-ing" style={{
                                                                            backgroundImage: `url(${rowBackgrounds[index]})`,
                                                                        }}></div>
                                                                    </div>
                                                                    <div className='c-text_rotate-first'><div><span> 10 </span><span> INCHES  </span></div></div>
                                                                </div>
                                                                </div>
                                                                <div class="c-text_rotate-bottom-first">7.5 INCHES</div>
                                                            </Col> : ''}
                                                        {imgIndex === 0 && imagePreviews[`${imgKey}.${index}`] && rowBackgrounds[index] ?
                                                            <Col md={12} key={imgIndex} style={{ marginTop: '0px', padding: '2px' }}>
                                                                {imagePreviews[`${imgKey}.${index}`] && (
                                                                    <>
                                                                        <div className=' text-center fs-1 m-1'>Design No: {imageNames[`firstimage.${index}`]}</div>
                                                                        <div className='img-dis c-a_box-style'>
                                                                            <div className='c-border_style-a c-single_border_style'><span>A</span></div>
                                                                            <div className='c-box-item-3 c-box_item-cover'>
                                                                                <img src={rowBackgrounds[`${index}`]} alt={`Preview ${imgIndex + 1}`} style={{ width: '96%', border: '1px solid black' }} />
                                                                                <div className='c-text_rotate-second'><div><span> 10 </span><span> INCHES  </span></div></div>
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                )}
                                                                <div class="c-text_rotate-bottom-second">7.5 INCHES</div>
                                                            </Col>
                                                             : ' '}
                                                        {console.log("imgIndex",imgIndex)}
                                                        {imgIndex === 0  && imagePreviews[`secondimage.${index}`] && <div className='text-center fs-1 m-1'>Design No: {imageNames[`firstimage.${index}`]}</div>}
                                                        {imagePreviews[`${imgKey}.${index}`] && (rowBackgrounds[`${index}`] !== imagePreviews[`${imgKey}.${index}`]) && (
                                                            <>
                                                                <Col md={12} key={imgIndex} style={{ marginTop: '1px', marginBottom: '1px', padding: '2px' }}>
                                                                    <div className='img-dis c-box-item-3 c-box_item-3-cover'>
                                                                        <div className='c-border_style-a'><span>{String.fromCharCode(66 + temp)}</span></div>
                                                                        <img src={imagePreviews[`${imgKey}.${index}`]} alt={`Preview ${imgIndex + 1}`}/>
                                                                        <div className='c-text_rotate'><div><span> 3.5 </span><span> INCHES  </span></div></div>
                                                                    </div>
                                                                </Col>
                                                                {(() => { temp += 1; return null; })()}
                                                            </>
                                                        )}
                                                    </>
                                                ))}
                                                {temp >= 1 && <div class="c-text_rotate-bottom" style={{marginBottom:getMarginButtom(temp)}}>7 INCHES</div>}
                                            </Row>
                                        </Col>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardBody>
                    <CardFooter>
                        <div className="d-flex justify-content-end">
                            <Button color="primary" className="me-5" onClick={() => append({ firstimage: "", secondimage: "", thirdimage: "" })}>
                                <Plus size={14} />
                                <span className="align-middle ms-25">Add Section</span>
                            </Button>
                            <Button type="submit" color="primary" onClick={generatePDF} >
                                <span className="align-middle d-sm-inline-block d-none">Create PDF</span>
                            </Button>

                        </div>
                    </CardFooter>
                </Card>
            </Form>
        </>
    );
}

export default International;
