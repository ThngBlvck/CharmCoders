<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Variant extends Model
{
    use HasFactory;

    protected $fillable = ['product_id', 'price', 'quantity'];

    // Liên kết với sản phẩm
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function variantAttributeValues()
    {
        return $this->hasMany(VariantAttributeValue::class, 'variant_id');
    }

    // Mối quan hệ với bảng Attribute (Thông qua VariantAttributeValue)
    public function attributes()
    {
        return $this->belongsToMany(Attribute::class, 'variant_attribute_values', 'variant_id', 'attribute_value_id')
            ->withPivot('attribute_value_id')
            ->with('values');
        ; // Lấy giá trị của attribute_value_id
    }
    public function attributeValues()
    {
        return $this->belongsToMany(
            AttributeValue::class,
            'variant_attribute_values',
            'variant_id',
            'attribute_value_id'
        );
    }
}

