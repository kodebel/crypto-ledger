import React, { useState } from 'react';
import axios from 'axios';
import {useRouter} from "next/router";
import { NumericFormat } from 'react-number-format';


const typeOptions = [
    { value: 'buy', label: 'Buy' },
    { value: 'sell', label: 'Sell' },
    { value: 'transfer_in', label: 'Transfer In' },
    { value: 'transfer_out', label: 'Transfer Out' },
];

export default function TransactionFormModal() {
    const router = useRouter();
    const [formSubmitting, setFormSubmitting] = useState(false);
    const [show, setShow] = useState(false);
    const [form, setForm] = useState({
        datetime: '',
        type: 'buy',
        asset: '',
        amount: '',
        price_per_unit: '',
        total: '',
        fee: '',
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        ['amount', 'price_per_unit', 'total', 'fee'].forEach(field => {
            if (!form[field] || Number(form[field]) < 0) {
                newErrors[field] = 'Must be greater than 0';
            }
        });
        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = validate();
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            try {
                setFormSubmitting(true);
                await axios.post('/api/transactions', form);
                setShow(false);
                setForm({
                    datetime: '',
                    type: 'buy',
                    asset: '',
                    amount: '',
                    price_per_unit: '',
                    total: '',
                    fee: '',
                });
                setFormSubmitting(false);
                await router.push('/'); // Redirect to home
            } catch (err: any) {
                setErrors({ api: err.response?.data?.error || 'Failed to add transaction' });
                setFormSubmitting(false);
            }
        }
    };

    return (
        <>
            <button
                className="btn btn-dark mb-3 position-fixed"
                style={{ bottom: '32px', right: '32px', zIndex: 1050 }}
                onClick={() => setShow(true)}
                title="Add Transaction"
            >
                <i className="bi bi-plus-circle"></i>
            </button>
            {show && (
                <div className="modal show d-block" tabIndex={-1} role="dialog">
                    <div className="modal-dialog" role="document">
                        <form className="modal-content" onSubmit={handleSubmit}>
                            <div className="modal-header">
                                <h5 className="modal-title">Add Transaction</h5>
                                <button type="button" className="btn-close" onClick={() => setShow(false)} />
                            </div>
                            <div className="modal-body">
                                <div className="mb-2">
                                    <label className="form-label text-start">Datetime</label>
                                    <input
                                        type="datetime-local"
                                        className="form-control"
                                        name="datetime"
                                        value={form.datetime}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="form-label">Type</label>
                                    <select
                                        className="form-select"
                                        name="type"
                                        value={form.type}
                                        onChange={handleChange}
                                    >
                                        {typeOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-2">
                                    <label className="form-label">Asset</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="asset"
                                        value={form.asset.toUpperCase()}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="form-label">Amount</label>
                                    <NumericFormat
                                        className={`form-control${errors.amount ? ' is-invalid' : ''}`}
                                        name="amount"
                                        value={form.amount}
                                        onValueChange={values => setForm({ ...form, amount: values.value })}
                                        thousandSeparator
                                        prefix="Rp "
                                        allowNegative={false}
                                        placeholder="Amount"
                                        isAllowed={values => Number(values.value) >= 0}
                                    />
                                    {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
                                </div>
                                <div className="mb-2">
                                    <label className="form-label">Price per Unit</label>
                                    <NumericFormat
                                        className={`form-control${errors.price_per_unit ? ' is-invalid' : ''}`}
                                        name="price_per_unit"
                                        value={form.price_per_unit}
                                        onValueChange={values => setForm({ ...form, price_per_unit: values.value })}
                                        thousandSeparator
                                        allowNegative={false}
                                        prefix="Rp "
                                        placeholder="Price per Unit"
                                        isAllowed={values => Number(values.value) >= 0}
                                    />
                                    {errors.price_per_unit && <div className="invalid-feedback">{errors.price_per_unit}</div>}
                                </div>
                                <div className="mb-2">
                                    <label className="form-label">Fee</label>
                                    <NumericFormat
                                        className={`form-control${errors.fee ? ' is-invalid' : ''}`}
                                        name="fee"
                                        value={form.fee}
                                        onValueChange={values => setForm({ ...form, fee: values.value })}
                                        thousandSeparator
                                        allowNegative={false}
                                        prefix="Rp "
                                        placeholder="Fee"
                                        isAllowed={values => Number(values.value) >= 0}
                                    />
                                    {errors.fee && <div className="invalid-feedback">{errors.fee}</div>}
                                </div>

                                <div className="mb-2">
                                    <label className="form-label">Total</label>
                                    <NumericFormat
                                        className={`form-control${errors.total ? ' is-invalid' : ''}`}
                                        name="total"
                                        value={String(Number(form.amount || 0) + Number(form.fee || 0))}
                                        readOnly
                                        onValueChange={values => setForm({ ...form, total: values.value })}
                                        thousandSeparator
                                        allowNegative={false}
                                        prefix="Rp "
                                        placeholder="Total"
                                        isAllowed={values => Number(values.value) >= 0}
                                    />
                                    {errors.total && <div className="invalid-feedback">{errors.total}</div>}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShow(false)}>
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={Object.keys(errors).length > 0 || formSubmitting}
                                >
                                    Add
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
