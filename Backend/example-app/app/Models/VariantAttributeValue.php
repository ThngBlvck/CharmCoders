<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VariantAttributeValue extends Model
{
    use HasFactory;

    protected $fillable = ['variant_id', 'attribute_value_id'];

    // Liên kết với Variant
    public function variant()
    {
        return $this->belongsTo(Variant::class);
    }

    // Liên kết với AttributeValue
    public function attributeValue()
    {
        return $this->belongsTo(AttributeValue::class);
    }
}

